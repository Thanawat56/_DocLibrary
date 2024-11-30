const users = [
  {
    id: 10001,
    name: "ภูริภัช วงศ์ตั้งตน",
    pass: "pass",
    role: "Officer",
  },
  {
    id: 10002,
    name: "ธนวัฒน์ ณรงค์วงค์วัฒนา",
    pass: "pass",
    role: "Admin",
  },
  {
    id: 10003,
    name: "สพณดณัย เชื้อชาญ",
    pass: "pass",
    role: "SuperAdmin",
  },
];
export function verifyUser(userID, pass) {
  // ฟังก์ชันเช็คว่ามี user นี้ใน data หรือไม่
  const userFound = users.find((u) => {
    return u.id == userID && u.pass === pass;
  });
  
  // ถ้ามีจะ return name, role ถ้าไม่จะ return null
  return userFound ? {name: userFound.name, role: userFound.role } : null;
}
