const express = require('express');
const pool = require('./db');
const bodyParser = require('body-parser');
const { body , query , validationResult } = require('express-validator');
const app = express();
const path = require('path');
const { error } = require('console');
const PORT = 3000;

const cors = require("cors");

app.use(cors());

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// routes below


app.get('/',(req,res)=>{
    res.send('<h1>Express js api<h1>!')
})

//********** MENU MASTER  *********

app.get('/menu',  async(req,res)=>{
    try{
        const result=await pool.query('SELECT * FROM menu');
        res.json({status:"200",massage:"success",Menu:result.rows})
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.get( "/menubyid", [
    query("mid").notEmpty().withMessage("mid is required")
  ],async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { mid } = req.query;   // ✅ FIX HERE
      const result = await pool.query(
        "SELECT * FROM menu WHERE mid = $1",
        [mid]
      );
      if (result.rows.length > 0) {
        res.json({
          status: "200",
          message: "success",
          data: result.rows
        });
      } else {
        res.json({
          status: "404",
          message: "data not found"
        });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

app.post('/addmenu',[
    query('m_name').notEmpty().withMessage('m_name is required') ,
    query('m_price').notEmpty().withMessage('m_price is required'),
    query('gid').notEmpty().withMessage('gid is required') 
],  async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
        else{
        const {m_name,m_price,gid} = req.query;
        const result=await pool.query('INSERT INTO menu(m_name,m_price,gid) VALUES ($1,$2,$3) RETURNING *',
            [m_name,m_price,gid]);
            res.json({status:"200",massage:"success",Menu:result.rows})
        }
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.put('/updatemenu',[
    query('m_name').notEmpty().withMessage('m_name is required') ,
    query('m_price').notEmpty().withMessage('m_price is required'),
    query('gid').notEmpty().withMessage('gid is required') ,
    query('mid').notEmpty().withMessage('mid is required') 
], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
          else{
            const {mid,m_name,m_price,gid} = req.query;
            const rs=await pool.query('SELECT * FROM menu where mid=$1',[mid]);
            if(rs.rows.length>0){
                const result=await pool.query('update menu set m_name=$1, m_price=$2, gid=$3 where mid=$4',
                   [m_name,m_price,gid,mid]);
                   res.json({status:"200",massage:"update success",data:result.rows});
            }
            else{
                res.json({status:"200",massage:"update Faild"});
                }
                
            }
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.delete('/delmenu',  [
    query('mid').notEmpty().withMessage('mid is required')
 ], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        else{
        const {mid} = req.query;
        const rs=await pool.query('SELECT * FROM menu where mid=$1',[mid]);
        if(rs.rows.length>0){
        const result=await pool.query('delete from menu where mid=$1',[mid]);
        res.json({status:"200",massage:"Delete success"});
        }
        else{
            res.json({status:"200",massage:"Delete Faild"});
        }
    }
}
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

//------------- FOOD_GROUP -----------

app.get('/food_group',  async(req,res)=>{
    try{
        const result=await pool.query('SELECT * FROM food_group');
        res.json({status:"200",massage:"success",food_group:result.rows});
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.get('/foodgroupbyid', [
    query('gid').notEmpty().withMessage('gid is required')
],  async (req,res)=>{
   try{
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         } 
       else{
       const {gid} = req.query;
       const result=await pool.query('SELECT * FROM food_group where gid=$1',[gid]);
       if(result.rows.length>0){
           res.json({status:"200",massage:"success",data:result.rows});
       }
       else{
           res.json({status:"404",massage:"data not found"});
       }
       }
   }
   catch(err){
       console.error(err.massage);
       res.status(500).send('Server Error');
   }
});

app.post('/addfoodgroup',[
    query('group_name').notEmpty().withMessage('group_name is required') 
],  async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
        else{
        const {group_name} = req.query;
        const result=await pool.query('INSERT INTO food_group(group_name) VALUES ($1) RETURNING *',
            [group_name]);
            res.json({status:"200",massage:"success",Menu:result.rows})
        }
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.put('/updatefoodgroup',[
    query('group_name').notEmpty().withMessage('group_name is required') ,
    query('gid').notEmpty().withMessage('gid is required')
], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
          else{
            const {group_name,gid} = req.query;
            const rs=await pool.query('SELECT * FROM food_group where gid=$1',[gid]);
            if(rs.rows.length>0){
                const result=await pool.query('update food_group set group_name=$1 where gid=$2',
                   [group_name,gid]);
                   res.json({status:"200",massage:"update success",data:result.rows});
            }
            else{
                res.json({status:"400",massage:"update Faild"});
                }
                
            }
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.delete('/delfoodgroup',  [
    query('gid').notEmpty().withMessage('gid is required')
 ], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        else{
        const {gid} = req.query;
        const rs=await pool.query('SELECT * FROM food_group where gid=$1',[gid]);
        if(rs.rows.length>0){
        const result=await pool.query('delete from food_group where gid=$1',[gid]);
        res.json({status:"200",massage:"Delete success"});
        }
        else{
            res.json({status:"200",massage:"Delete Faild"});
        }
    }
}
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

//--------QTYMAST-------

app.get('/qtymast',  async(req,res)=>{
    try{
        const result=await pool.query('SELECT * FROM qtymast');
        res.json({status:"200",massage:"success",qty:result.rows});
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.get('/qtybyid', [
    query('qid').notEmpty().withMessage('qid is required')
],  async (req,res)=>{
   try{
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         } 
       else{
       const {qid} = req.query;
       const result=await pool.query('SELECT * FROM qtymast where qid=$1',[qid]);
       if(result.rows.length>0){
           res.json({status:"200",massage:"success",data:result.rows});
       }
       else{
           res.json({status:"404",massage:"data not found"});
       }
       }
   }
   catch(err){
       console.error(err.massage);
       res.status(500).send('Server Error');
   }
});

app.post('/addqty',[
    query('qtype').notEmpty().withMessage('qtype is required') 
],  async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
        else{
        const {qtype} = req.query;
        const result=await pool.query('INSERT INTO qtymast(qtype) VALUES ($1) RETURNING *',
            [qtype]);
            res.json({status:"200",massage:"success",Menu:result.rows})
        }
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.put('/updateqty',[
    query('qtype').notEmpty().withMessage('qtype is required') ,
    query('qid').notEmpty().withMessage('qid is required')
], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          } 
          else{
            const {qtype,qid} = req.query;
            const rs=await pool.query('SELECT * FROM qtymast where qid=$1',[qid]);
            if(rs.rows.length>0){
                const result=await pool.query('update qtymast set qtype=$1 where qid=$2',
                   [qtype,qid]);
                   res.json({status:"200",massage:"update success",data:result.rows});
            }
            else{
                res.json({status:"400",massage:"update Faild"});
                }
                
            }
    }
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});

app.delete('/delqty',  [
     query('qid').notEmpty().withMessage('qid is required')
 ], async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        else{
        const {qid} = req.query;
        const rs=await pool.query('SELECT * FROM qtymast where qid=$1',[qid]);
        if(rs.rows.length>0){
        const result=await pool.query('delete from qtymast where qid=$1',[qid]);
        res.json({status:"200",massage:"Delete success"});
        }
        else{
            res.json({status:"200",massage:"Delete Faild"});
        }
    }
}
    catch(err){
        console.error(err.massage);
        res.status(500).send('Server Error');
    }
});




app.listen(3000, () => {
  console.log('Server is running on port http://localhost:3000/');
});







