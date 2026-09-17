// const pool = require("../db")
// const findUserbyEmail=async(email)=>{
//     const result =await pool.query(
//         "SELECT * FROM person WHERE email=$1",
//         [email]
//     );
//     return result.rows[0];

// };
// module.exports={
//     findUserbyEmail,
// };
// const pool =require("../db")
// const findUserbyEmail=async(email)=>{
//     const result=await pool.query(
//         "SELECT * FROM person WHERE email=$1",
//         [email]
//     );
//     return result.rows[0]
// };
// module.exports={
//     findUserbyEmail,
// };

const pool =require("../db")
const createuser=async(name,email,password)=>{
    const result=await pool.query(
      `INSERT INTO person (name,email,password)
      VALUES($1,$2,$3)
      RETURNING id,name,password,created_at`,
      [name,email,password]  
    );
    return result.rows[0];
};
const findUserbyEmail= async(email)=>{
    const result=await pool.query(
       "SELECT * FROM person WHERE email=$1",
       [email]
    )
    return result.rows[0];
};
module.exports={
    createuser,
    findUserbyEmail,
};