import { User } from "../modules/User/user.model";

const admin = {
  name: "Montasir Mihad",
  email: "ahmedmihad962@gmail.com",
  role: "admin",
  password: "123456",
  profileImage:
    "https://i.ibb.co/MHpMRvT/c9c023a7-7a94-4101-b73e-c4b5bea09c38-enhanced.png",
};

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await User.findOne({
    email: admin.email,
  });
  if (!isSuperAdminExist) {
    await User.create(admin);
  }
};

export default seedSuperAdmin;
