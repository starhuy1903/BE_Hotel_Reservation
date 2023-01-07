const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
const mongoose = require("mongoose");
const User = require("../app/models/user");
const Category = require("../app/models/category");
const Room_Type = require("../app/models/roomType");
const Hotel = require("../app/models/hotel");
const Room = require("../app/models/room");
const Reservation = require("../app/models/reservation");
const Reservation_Status_Catalog = require("../app/models/reservationCatalog");
const Reservation_Status_Event = require("../app/models/reservationStatusEvent");
const ServedRoom = require("../app/models/servedRoom");

const bcrypt = require("bcryptjs");

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  branding: {
    companyName: "Hotel Reservation",
    logo: "",
    softwareBrothers: false,
  },
  resources: [
    {
      resource: User,
      options: {
        parent: {
          name: "User",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          username: {
            isTitle: true,
          },
          password: { isVisible: { list: false } },
          first_name: {},
          last_name: {},
          email: {},
          phoneNumber: {},
          address: {},
          roles: {   
            availableValues: [
              { value: "1001", label: "Admin" },
              { value: "2002", label: "User" },
              { value: "3003", label: "Business" },
            ]
          },
          isActive: {},
          verified: {},
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
      actions: {
        new: {
          before: async (request) => {
            if (request.payload.password) {
              request.payload = {
                ...request.payload,
                password: await bcrypt.hash(
                  request.payload.password,
                  bcrypt.genSaltSync(10)
                ),
              };
            }
            return request;
          },
        },
      },
    },
    {
      resource: Category,
      options: {
        parent: {
          name: "Hotel",
          icon: "Hotel",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          category_name: {
            isTitle: true,
          }
        },
      },
    },
    {
      resource: Hotel,
      options: {
        parent: {
          name: "Hotel",
          icon: "Hotel",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          category_id: {
            reference: 'category',
          },
          owner_id: {
            reference: 'user',
            // isVisible: { list: true, filter: true, show: true, edit: false },
            label: 'Owner'
          },
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
    },
    {
      resource: Room_Type,
      options: {
        parent: {
          name: "Room",
          icon: "Room",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          typeName: {
            isTitle: true,
          },
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
    },
    {
      resource: Room,
      options: {
        parent: {
          name: "Room",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          room_name: {},
          hotel_id: {
            reference: 'hotel',
            isTitle: true,
          },
          floor: {},
          room_type_id: {
            // reference: 'room_type'
          },
          current_price: {
            type: "currency",
            // props: {
            //   decimalSeparator: ".",
            //   disableGroupSeparators: true,
            //   prefix: "d",
            // },
          },       
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
    },
    {
      resource: ServedRoom,
      options: {
        parent: {
          name: "Room",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          roomId: {
            reference: 'room'
          }
        }
      },
    },
    {
      resource: Reservation,
      options: {
        parent: {
          name: "Reservation",
          icon: "Reservation",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: false, show: false, edit: false },
          },
          userId: {
            reference: 'user'
          },
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
    },
    {
      resource: Reservation_Status_Catalog,
      options: {
        parent: {
          name: "Reservation",
          icon: "Reservation Status Catalog",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          statusName: {
            isTitle: true,
          },
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },
      },
    },
    {
      resource: Reservation_Status_Event,
      options: {
        parent: {
          name: "Reservation",
          icon: "Reservation Status Event",
        },
        properties: {
          _id: {
            isVisible: { list: false, filter: true, show: true, edit: false },
          },
          reservationId: {
            // reference: 'reservation'
          },
          reservationStatusCatalogId: {
            reference: 'reservation_status_catalog'
          },
          details: {},
          createdAt: {
            isVisible: { show: false },
          },
          updatedAt: {
            isVisible: { show: false },
          },
        },       
      },
    },
  ],
  locale: {
    translations: {
      labels: {
        loginWelcome: "Admin Panel Login",
      },
      messages: {
        loginWelcome:
          "Please enter your credentials to log in and manage your website contents",
      },
    },
  },
});

// const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
//   authenticate: async (email, password) => {
//     const user = await User.findOne({ email });
//     if (user) {
//       const matched = await bcrypt.compare(password, user.password);
//       if (matched) return user;
//     }
//     return false;
//   },
//   cookiePassword: "some-secret-password-used-to-secure-cookie",
// });

const router = AdminBroExpress.buildRouter(adminBro);

module.exports = router;
