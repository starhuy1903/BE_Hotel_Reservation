const User = require("../models/user");
const verifyToken = require("../models/token");
const bcrypt = require("bcryptjs");
const createError = require("../../utils/error");
const ROLES_LIST = require("../../config/allowedRoles");
const { getHistory } = require("../service/History");
class UserController {
  index(req, res) {
    res.send("Hello from user");
  }

  async createUser(req, res, next) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      let roles = [];
      for (let role of req.body.roles) {
        for (let key in ROLES_LIST) {
          if (role === key) roles.push(ROLES_LIST[key]);
        }
      }

      const newUser = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email,
        roles: roles,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        isActive: true,
        verified: true,
      });
      await newUser.save();
      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  }
  updateUser = async (req, res, next) => {
    try {
      if (!req.user.id) return next(createError(403, "You're not authorized"));
      const { username, email, roles, verified, password } = req.body;
      if (username || email || roles || verified || password)
        return next(createError(400, "Bad Request"));
      if (!req.body.newPassword) {
        await User.findByIdAndUpdate(
          req.user.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json({ message: "User Profile has been updated" });
      }
      else{
        const user = await User.findOne({ _id: req.user.id });
        if (!user) return next(createError(404, "Username Not Found "));
        if (!req.body.oldPassword) return next(createError(400, "Bad Request"));

        const isPasswordCorrect = await bcrypt.compare(
          req.body.oldPassword,
          user.password
        );
        if (!isPasswordCorrect)
          return next(createError(400, "Wrong password"));
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        await User.findByIdAndUpdate(
          req.user.id,
        { $set: req.body, password: hash },
        { new: true }
      );
      res.status(200).json({ message: "User Profile has been updated" });
      }
      
    } catch (err) {
      next(err);
    }
  };

  async updateUserByAdmin(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return next(createError(404, "Not Found"));
      let roles = [];
      if(req.body.roles){
        for (let role of req.body.roles) {
          for (let key in ROLES_LIST) {
            if (role === key) roles.push(ROLES_LIST[key]);
          }
        }
      }
      else{
        roles = user.roles;
      }
      if (!req.body.password) {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: req.body, roles},
          { new: true }
        );
        res.status(200).json(updatedUser);
      }
      
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body, password: hash, roles: roles },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) return next(createError(404, "Not Found"));
      res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const newUser = await User.findById(req.params.id);
      if (!newUser) return next(createError(404, "Not Found"));
      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  async getAllUser(req, res, next) {
    try {
      const column = req.query.column || "roles";
      const sort = req.query.sort || 1;
      const page = req.query.page || 1;
      const Users = await User.find({ ...req.query }).sort({ [column]: sort });
      const availablePage = Math.ceil(Users.length / process.env.PER_PAGE);
      if (page > availablePage && Users.length !== 0)
        return next(createError(400, "Page not found"));
      res.status(200).json(Users);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return next(createError(400, "Invalid link"));

      const token = await verifyToken.findOne({
        user_id: user._id,
        key: req.params.key,
      });

      if (!token) return next(createError(400, "Invalid link"));

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      await User.findByIdAndUpdate(user._id, { password: hash }, { new: true });
      await token.remove();

      res.status(200).json({ message: "Reset Password Successfully" });
    } catch (err) {
      next(err);
    }
  }
  async verifyEmailUser(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) return next(createError(400, "Invalid link"));

      const token = await verifyToken.findOne({
        user_id: user._id,
        key: req.params.key,
      });

      if (!token) return next(createError(400, "Invalid link"));

      await User.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        { new: true }
      );
      await token.remove();

      res.status(200).json({ message: "Verify User Email Successfully" });
    } catch (err) {
      next(err);
    }
  }
  getUserProfile = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.user.id });
      if (!user) return next(createError(400, "Not Found"));
      const { password, roles, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } catch (err) {
      next(err);
    }
  };

  getUserHistory = async (req, res, next) => {
    try {
      const history = await getHistory(req.user.id);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = new UserController();
