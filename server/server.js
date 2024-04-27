const express = require('express');
const mysql = require('mysql2');
const app = express()
const PORT = 5000;
const bodyParser = require('body-parser'); // For parsing JSON requests
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const onFinished = require('on-finished');
const { error } = require('console');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });
const buildPath = path.join(__dirname, '..', 'em-see', 'build');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Arboleda119',
  database: 'sys',
  connectionLimit: 10,
});

app.use(express.static(buildPath));
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors());
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.urlencoded());
app.use((req,res,next) => {
    console.log(req.url);
    next();
});


app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
    db.connect(function(err){
        if(err) throw err;
        console.log('Database connected')
    })
}
    
)


// GET API



app.get('/', (req, res) => {
  // send back a message that the server is running
  res.send("It's working!");
})

app.get('/Api/Inventory-history', (req,res) => {
  db.query("Select * from inventory_history", (err,result) => {
    if(err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
      return;
    }
    res.json(result);
  })
})

app.get('/History', (req, res) => {
  const sql ='Select * from history'  ;
 
  db.query(sql, (err, req) => {
    if(err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
      return;
    }
    res.json(req);
  })
})

app.get('/Api/reservationRequest/:selectedDate', (req, res) => {
  const sql = "SELECT * FROM reservation_request where status = 'Pending' and eventDate like ?";
  const dateParts = req.params.selectedDate.split('-'); // Split the date string by '-'
  const formattedDate = `%${dateParts[0]}/${dateParts[1].padStart(2, '0')}/${dateParts[2]}%`; // Format the date
  db.query(sql, formattedDate, (err, respo) => {
    if (err) {
      console.log(err);
    } else {
      res.json(respo);
    }
  });
});

app.get('/Api/Available', (req, res) => {
  const status = 'Functional'
  const sql = `SELECT * FROM inventory_table WHERE AVAILABILITY = 'Available' AND status = ?;`;
  db.query(sql, status, (err, respo) => {
    if (err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    } else {
      res.json(respo);
    }
  });

});

app.get('/Api/Reserved/:date', (req, res) => {
  const selectedDate = `%${req.params.date}%`;
  const dateComponents = selectedDate.split('-');
  const reformattedDate = dateComponents.join('/');
  db.query('SELECT * FROM reservations WHERE eventDate LIKE ?', reformattedDate, (err, itemList) => {
    if (err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
      return;
    } 
    res.json(itemList);
  });
});

app.get('/Api/Inventory', (req, res) => {
  const sql = "SELECT * FROM inventory_table where activity = 'Active'";

  db.query(sql, (err, itemList) => {
    if (err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    } else {
      res.json(itemList);
    }
  });
});

app.get('/Api/Borrowed', (req, res) => {
  const sql = "SELECT * FROM borrow";

  // Execute the query and handle errors
  db.query(sql, (err, itemList) => {
    if (err) {
      console.error('Error while executing the query:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
      return;
    }

    console.log('get complete')
    res.json(itemList);
  });
});

app.get('/Api/ClientId/:clientId', async (req, res) => {
  const enteredClientId = req.params.clientId;

  try {
    const [userDataRows] = await db.promise().query(`SELECT FullName, UserId FROM user_table WHERE UserId = ?`, [enteredClientId]);

    if (userDataRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      FullName: userDataRows[0].FullName,
      UserId: userDataRows[0].UserId,
      // Add other data based on your requirements
    };

    // Send the response as JSON
    res.json(userData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/ClientId', (req, res) => {
  const userId = req.body;
  const sql = `SELECT FullName, UserId  FROM user_table where UserId == '${userId}'` ;
  db.query(sql, (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Internal server error'});
    } else {

      res.json(results);
    }
  });
});

app.get('/Register', (req, res) => {
  const sql = 'SELECT * FROM user_table';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error:', error.message);
      console.error('Stack Trace:', error.stack);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

app.get('/history', (req, res) => {
  const sql = 'SELECT * FROM history ORDER BY timestamp DESC';

  db.query(sql, (err, historyList) => {
    if (err) {
      console.error('Error while executing the history query:', err);
      res.status(500).json({ error: 'An error occurred while fetching history data' });
    } else {
      res.json(historyList);
    }
  });
});

app.get('/Api/Add-history', (req, res) => {
  const sql = 'SELECT * FROM inventory_add';

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error while executing the history query:', err);
      res.status(500).json({ error: 'An error occurred while fetching history data' });
    } else {
      res.json(result);
    }
  });
})

app.get('/Api/Reservation-request-history', (err, res) => {
  db.query('Select * from reservation_request', (err, result) => {
    if(err){
      res.status(500).json({ error: 'An error occurred while fetching history data' });
    }else{
      res.send(result);
    }
  })
})

app.get('/Api/Transaction-history', (err, res) => {
  db.query('select * from transaction_history', (err, result) => {
    if(err){
      console.log('Transaction history fecthing failed', err)
    } else{
      console.log("Transactiong history fecthed successfully")
      res.send(result)
    }
  })
})

app.get('/Api/Reservation-reports', (err, res) => {
  db.query('Select fileDate,department  from reservation_request_history where status = "Approved";', (err, result) => {
    if(err){
      res.status(500).json({ error: 'An error occurred while fetching history data' });
    }else{
      res.send(result);
    }
  })
})

app.get('/Api/User-management', (req, res) => {
  db.query('select * from user_table', (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.send(result);
    }
  })
})

app.get('/Api/User-history/:UserId', (req, res) => {
  const { UserId } = req.params;
  const sql = `SELECT itemCode, borrowDateTime, returnDateTime, status FROM transaction_history WHERE ClientId = ?`;
  db.query(sql, UserId, (err, result) => {
    if (err) {
      console.error("Error fetching user history:", err);
      res.status(500).json({ error: 'Failed to fetch user history' });
    } else {
      res.json(result);
    }
  });
});

app.get('/Request-summary/:UserId', (req,res) => {
  const {UserId} = req.params;
  db.query(
    'SELECT eventName, eventDate, itemName, itemQuant, status FROM reservation_request_history WHERE clientId = ?',
    [UserId],
    (err, response) => {
      if (err) {
        console.error('Error fetching user history:', err);
        res.status(500).json({ error: 'Failed to fetch user history' });
      } else {
        console.log('User history fetched successfully:', response);
  
        res.json(response);
      }
    }
  );
})

app.get('/Api/RequestCount', (req, res) => {
  const count = {};
  db.query('SELECT eventDate FROM reservation_request where status = "Pending"', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      rows.forEach(row => {
        const eventDate = new Date(row.eventDate).toLocaleDateString();
        // Increment count for the eventDate or initialize to 1 if it doesn't exist
        count[eventDate] = (count[eventDate] || 0) + 1;
      });
      res.json(count);
    }
  });
});




// POST API
app.post('/Api/submitReservation', (req, res) => {
  const { clientName, clientId, purpose, department, venue, eventDate, eventEnd, contactInfo, items } = req.body;
  const formatting = (date) => {
    const dated = new Date(date);
    const formattedDate = dated.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return formattedDate;
  };

  let successfulInsertions = 0;
  const totalInsertions = items.length;

  items.forEach((item) => {
    const query = 'INSERT INTO reservation_request (clientName, clientId, eventName, department, venue, eventDate, eventEnd, fileDate, itemType, itemQuant, contactNo, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [clientName, clientId, purpose, department, venue, formatting(eventDate), formatting(eventEnd), formatting(new Date()), item.item, item.quantity, contactInfo, 'Pending'];

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
      } else {
        console.log('Data inserted into the database');
        successfulInsertions++;
        if (successfulInsertions === totalInsertions) {
          res.status(200).json({ message: 'Form data received and stored successfully' });
        }
      }
    });
  });
});


app.post('/Api/Borrow', async (req, res) => {
  const { itemCode, itemName, itemImage, clientName, clientId, inchargeName } = req.body;
  const currentDate = new Date();
  const borrowDateTime = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  const insertBorrowQuery = 'INSERT INTO borrow (itemCode, inchargeName, schoolId, clientName, dateTime, image, itemName) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(insertBorrowQuery, [itemCode, inchargeName, clientId, clientName, borrowDateTime, itemImage, itemName], (err, result) => {
    if (err) {
      console.error('Error inserting transaction data:', err);
      return res.status(500).json({ error: "Error inserting transaction data" });
    }else{
      const updateInventoryQuery = 'UPDATE inventory_table SET Availability = "Borrowed" WHERE itemCode = ?';
      db.query(updateInventoryQuery, itemCode, (err, ret) => {
        if (err) {
          console.error('Error updating inventory table:', err);
          return res.status(500).json({ error: "Error in updating table" });
        }else{
          const insertTransactionQuery = 'INSERT INTO transaction_history (itemCode, clientName, clientId, borrowIncharge, borrowDateTime) VALUES (?, ?, ?, ?, ?)';
          db.query(insertTransactionQuery, [itemCode, clientName, clientId, inchargeName, borrowDateTime], (err, response) => {
            if (err) {
              console.error('Error inserting transaction history:', err);
              return res.status(500).json({ error: "Error inserting transaction history" });
            }
      
            const deleteReservationQuery = 'DELETE FROM reservations WHERE itemCode = ?';
            db.query(deleteReservationQuery, itemCode, (err, output) => {
              if (err) {
                console.error('Error deleting reservations:', err);
                return res.status(500).json({ error: "Error in deleting item" });
              }
              
      
            });
          });
        }
      });
    }

  });
});


app.post('/Api/Inventory', upload.single('FileImage'), (req, res) => {
  const { ItemName, ItemCode, SerialCode, Brand, Availability, Status, Incharge } = req.body;
  let Image = req.file.filename;
  const Activity = 'Active';
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });  
  const sql = `
    INSERT INTO inventory_table (ItemName, ItemCode, SerialCode, Brand, Availability, Status, Image, Activity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [ItemName, ItemCode, SerialCode, Brand, Availability, Status, Image, Activity], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
        db.query(`Insert Into inventory_add (itemCode, itemName,  serialCode, dateTime, incharge) values (? , ? , ? ,? ,?)`, [ItemCode, ItemName, SerialCode,formattedDate ,Incharge], (err, result) => {
      if(err){
        console.error('Error inserting data:', err);
    }else{
      res.json({ message: 'Data inserted successfully' });
      console.log('Data Inserted');
    }
  } )
    }
  });
});

app.post('/Api/BatchRegister', async (req, res) => {
  try {

      const sql = 'INSERT INTO user_table (UserId, FullName, Department, Role, Password) VALUES (?, ?, ?, ?, ?)';
      
      // Iterate over each object in the req.body array
      for (const user of req.body) {
          const { userId, fullName, department, role } = user;
          const password = await bcrypt.hash(userId.toString(), 10);

          db.query(sql, [userId, fullName, department, role, password], (err, response) => {
              if (err) {
                  console.error('Error in registering user:', err);
                  // Don't send response inside the loop, handle errors collectively
              }
          });
      }
      
      // Send success response after all queries are executed
      res.status(200).json({ success: 'Batch registered successfully' });
  } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ error: 'Error in registering the batch' });
  }
});


app.post('/login', async (req, res) => {
  const { Id, password } = req.body;
  try {
    const [user] = await db.promise().query('SELECT * FROM user_table WHERE userId = ?', [Id]);
    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid User Id' });
    }

    const hashedPassword = user[0].Password.trim();
    const passwordMatch = await bcrypt.compare(password.trim(), hashedPassword);
    if (passwordMatch) {
      if(user[0].UserId.toString() === password){
        const userData = {
          FullName: user[0].FullName,
          UserId: user[0].UserId,
          Department: user[0].Department,
          Role: user[0].Role,
          State: 'Initial'
        }
        return res.status(200).json({ message: 'Login successful', userData });
      }else{
        const userData = {
          FullName: user[0].FullName,
          UserId: user[0].UserId,
          Department: user[0].Department,
          Role: user[0].Role,
          State: 'Changed'
        };
        return res.status(200).json({ message: 'Login successful', userData });
      }
    } else {
      return res.status(401).json({ message: 'Wrong Password' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/Api/Register', async (req, res) => {
  try {
    // Destructure user data from the request body
    const { fullName, role, department, userId, password } = req.body;
    console.log('Received registration data:', req.body); // Debugging line

    // Check if the userId already exists in the database
    const existingUsers = await db.execute('SELECT userId FROM user_table WHERE userId = ?', [userId || null]);

    if (existingUsers && existingUsers.length > 0) {
      // If userId already exists, respond with an error
      console.error(`User registration failed: userId '${userId}' already exists.`);
      return res.status(400).send(`User registration failed: userId '${userId}' already exists.`);
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword); // Debugging line

    // SQL query for user insertion
    const sqlInsertUser = `
      INSERT INTO user_table (UserId, Password,  Role, FullName,  Department)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Insert user data into the 'user_table'
    db.execute(sqlInsertUser, [
      userId,
      hashedPassword,
      role,
      fullName,
      department
    ], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'An error occurred' });
      } else {
        console.log('Data inserted successfully');
        res.json({ message: 'Data inserted successfully' });
      }
    });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/Api/Reservations', (req, res) => {
  const { reservation, ItemCode, clientName, clientId, eventName, venue, eventDate, eventEnd, contactNo, ItemName, Incharge } = req.body;
  const submissionDateTime = new Date().toLocaleDateString();
  const promises = [];

  ItemCode.forEach((itemCode) => {
    const dataToInsert = {
      clientName,
      clientId,
      eventName,
      venue,
      eventDate,
      eventEnd,
      submissionDateTime,
      contactNo,
      ItemName,
      Incharge,
      ItemCode: itemCode,
      status: 'Pending'
    };

    db.query('INSERT INTO reservations SET ?', dataToInsert, (err, result) => {
      if (err) {
        console.error('Error inserting into reservations table:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        db.query('UPDATE inventory_table SET Availability = "Reserved" WHERE ItemCode = ?', itemCode, (err, resu) => {
          if (err) {
            console.error('Error updating inventory table:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            console.log("Availability changed successfully");
            db.query('UPDATE reservation_request SET processingDate = ?, incharge = ?, status = "Approved" WHERE resevationId = ?', [submissionDateTime, Incharge, reservation], (err, updateRes) => {
              if (err) {
                console.error('Error updating reservation_request table:', err);
                res.status(500).json({ error: 'Internal Server Error' });
              } else {
                console.log('Updated reservation_request table successfully');
                res.status(200).json({ success: 'Reservation and items submitted successfully' });
              }
            });
          }
        });
      }
    });
  });
});

app.put('/Api/Reservation-reject', (req, res) => {
  const {resevationId,Incharge} = req.body
  const currentDate = new Date().toLocaleDateString();
  db.query('Update reservation_request set status = "Rejected", incharge = ?, processingDate =?  where resevationId = ?',[Incharge, currentDate, resevationId], (err, respo) => {
    if(err){
      res.status(500).json({error: 'Internal Server Error'})
    }else{
      res.status(200).json({success: 'Request has been rejected'})
    }
  })
 
 });  
 

app.put('/Api/ReleaseItems', (req, res) => {
  const release = req.body;
  const sql = 'UPDATE reservations SET status = "Released" WHERE reservationId = ?';
  const promises = release.map((id) => {
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, respo) => {
        if (err) {
          reject(err);
        } else {
          db.query('SELECT ItemCode FROM reservations WHERE reservationId = ?', id, (err, result) => {
            if (err) {
              reject(err);
            } else {
              const itemCode = result[0].ItemCode;
              db.query('UPDATE inventory_table SET Availability = "Released" WHERE ItemCode = ?', itemCode, (err, response) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(respo);
                }
              });
            }
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: 'Reservations updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.put('/Api/ReturnItems', (req, res) => {
  const release = req.body;
  const sql = 'UPDATE reservations SET status = "Completed" WHERE reservationId = ?';
  const promises = release.map((id) => {
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, respo) => {
        if (err) {
          reject(err);
        } else {
          db.query('SELECT ItemCode FROM reservations WHERE reservationId = ?', id, (err, result) => {
            if (err) {
              reject(err);
            } else {
              const itemCode = result[0].ItemCode;
              db.query('UPDATE inventory_table SET Availability = "Available" WHERE ItemCode = ?', itemCode, (err, response) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(respo);
                }
              });
            }
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: 'Reservations updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.put('/Api/CancelItems', (req, res) => {
  const release = req.body;
  const sql = 'UPDATE reservations SET status = "Cancelled" WHERE reservationId = ?';
  const promises = release.map((id) => {
    return new Promise((resolve, reject) => {
      db.query(sql, id, (err, respo) => {
        if (err) {
          reject(err);
        } else {
          db.query('SELECT ItemCode FROM reservations WHERE reservationId = ?', id, (err, result) => {
            if (err) {
              reject(err);
            } else {
              const itemCode = result[0].ItemCode;
              db.query('UPDATE inventory_table SET Availability = "Available" WHERE ItemCode = ?', itemCode, (err, response) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(respo);
                }
              });
            }
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: 'Reservations updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



// PUT

app.put('/Api/Available/:itemCode', (req, res) => {
  const { itemCode } = req.params;
  const { condition, inchargeName } = req.body;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });  
  var status;
  var availability;
  switch(condition){
    case 'Good': 
      status = 'Functional';
      availability = 'Available';
    break;
    case 'Broken':
       status = 'Faulty';
       availability = 'Unavailable';
    break;
    case 'Missing':
      status = 'Missing';
       availability = 'Unavailable';
    break;
    default:
    return res.status(404).json({message: 'Object Not Found'});
  }

  const sql = 'UPDATE inventory_table SET Availability = ?, Status = ? WHERE ItemCode = ?';

  db.query(sql, [availability, status, itemCode], (err, result) => {
    if (err) {
      console.error('Error updating inventory:', err);
      res.status(500).json({ error: 'An error occurred while updating inventory' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Object not found in inventory' });
    } else {
      db.query("update transaction_history set status = ?, returnIncharge = ?, returnDateTime = ? where itemCode = ?", [status, inchargeName, formattedDate, itemCode], (err, response) => {
        if(err){
          res.status(500).json({ error: 'An error occurred while logging the history' });
        }else{
          db.query('DELETE FROM borrow WHERE itemCode = ?', [itemCode], (err, respo) => {
            if(err){
              res.status(500).json({ error: 'An error occurred while deleting item' });
            }else{
              res.status(200).json({ message: 'Objects updated successfully' });
            }
          })

        }

      })
    }
  });
});



app.put('/Available', (req, res) => {
  const { ItemCodeArray, Availability } = req.body;

  if (!ItemCodeArray || !Array.isArray(ItemCodeArray) || Availability === undefined) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  const sql = 'UPDATE inventory_table SET Availability = ? WHERE ItemCode IN (?)';

  // Execute the query and handle errors
  db.query(sql, [Availability, ItemCodeArray], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'An error occurred' });
    } else if (result.affectedRows === 0) {
      // No rows were updated, meaning the objects were not found
      res.status(404).json({ message: 'Objects not found' });
    } else {
      res.status(200).json({ message: 'Objects updated successfully' });
      console.log('Objects updated successfully');
    }
  });
});

app.put('/login', async (req, res) => {
  const { userId, password } = req.body.user;
  const hashedPassword = await bcrypt.hash(password, 10)
    const sql = 'UPDATE user_table SET Password = ? WHERE UserId = ?';
  
  db.query(sql, [hashedPassword, userId], (err, result) => {
    if (err) {
      console.error('Error while updating password:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Password updated successfully' });
    }
  });
});

app.put('/Api/DeleteItems/:Incharge', (req, res) => {
  const deletingItems = req.body;
  const incharge = req.params.Incharge; // Correct parameter handling
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const promises = [];
  deletingItems.forEach(item => {
    const ItemCode = item.ItemCode;
    const Purpose = item.Purpose;
    let status;
    
    switch(Purpose) {
      case 'BROKEN':
        status = 'Faulty';
        break;
      case 'LOST':
        status = 'Missing';
        break;
      default:
        status = 'Retired';
        break;
    }

    const promise = new Promise((resolve, reject) => {
      db.query('UPDATE inventory_table SET availability = "Unavailable", status = ?, activity = "Inactive" WHERE ItemCode = ?', [status, ItemCode], (err, resp) => {
        if(err){
          reject(err);
        } else {
          db.query('SELECT ItemCode, ItemName, SerialCode FROM inventory_table WHERE ItemCode = ?', [ItemCode], (err, respo) => { // Correct placeholder usage
            if(err){
              reject(err);
            } else {
              const selectedItem = respo[0]; // Assuming you want to select the first row
              const sql = `INSERT INTO inventory_history (itemCode, itemName, serialCode, DateTime, PersonIncharge, Purpose) VALUES (?, ?, ?, ?, ?, ?)`;
              db.query(sql, [selectedItem.ItemCode, selectedItem.ItemName, selectedItem.SerialCode, formattedDateTime, incharge, Purpose], (err, result) => {
                if (err) {
                  console.error('Error inserting into MySQL:', err);
                  reject(err);
                } else {
                  resolve();
                }
              });
            }
          });
        }
      });
    });

    promises.push(promise);
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).json({ success: 'Items Deactivated Successfully' });
    })
    .catch(err => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.put('/Api/Reactivation', (req,res) => {
  const {historyId, itemCode} = req.body;
  const sql = "update inventory_table set Activity = 'Active', Status = 'Functional', Availability = 'Available' where ItemCode in (?)";
  db.query(sql, itemCode, (err, resp) => {
    if(err){
      res.status(500).json({error: 'Internal Server Error'})
    } else {
      db.query('Delete from inventory_history where HistoryId = ?', historyId, (req, respo) => {
        if(err){
          res.status(500).json({error: 'Internal Server Error'})
        } else{
          res.status(200).json({success: 'Item Reactivation Succeed'})
        }
      })
    }
  }) 
})


// DELETE API

app.delete('/Reservation/:itemCode', async (req, res) => {
  try {
    const itemCode = req.params.itemCode;

    const deleteQuery = 'DELETE FROM reservations WHERE ItemCode = ?';

    db.query(deleteQuery, [itemCode], (err, result) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.log(`Item with itemCode ${itemCode} has been marked as returned`);
        res.status(200).json({ message: 'Item marked as returned successfully' });
      }
    });
  } catch (error) {
    console.error('Error marking item as returned:', error);
    res.status(500).json({ error: 'An error occurred while marking item as returned' });
  }
});


app.delete('/Api/Delete-reserved', (req, res) => {
  const itemCode = req.body
  db.query("Delete from reservations where ItemCode = ?", itemCode, (err, result) => {
    if(err){
      res.status(500).json({error: "Reserved Item Deletion Failed?"})
    } else{
      res.status(200).json({success: "Item Deleted Successfully"})
    }
  } )
})

app.delete('/Borrowed/:itemCode', (req, res) => {
  const { itemCode } = req.params;
  const returnDate = new Date().toLocaleString();

  const deleteBorrowQuery = 'DELETE FROM borrow WHERE itemCode = ?';

  db.query(deleteBorrowQuery, [itemCode], async (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      res.status(500).json({ error: 'An error occurred while deleting the item' });
    } else if (result.affectedRows === 0) {
      // No rows were deleted, meaning the object was not found
      res.status(404).json({ message: 'Item not found' });
    } else {
      try {
        // Log the return to history after successful deletion
        const transaction = "Returned";
        // const returnDate = new Date();
        const updateHistoryQuery = `
        UPDATE history
        SET
          transaction2 = ?,
          returnDate=?
        WHERE
          itemCode = ?`;
  
      const updateHistoryValues = [
        transaction,
        returnDate,
        itemCode,
      ];
  
      await db.promise().query(updateHistoryQuery, updateHistoryValues);

        // await db.promise().query(logHistoryQuery, logHistoryValues);
        
        // Send success response
        res.status(200).json({ message: 'Item returned and history logged successfully' });
        console.log(itemCode, 'was returned on', returnDate);
      } catch (error) {
        console.error('Error logging history:', error);
        res.status(500).json({ error: 'An error occurred while logging history' });
      }
    }
  });
});

app.delete('/Api/Delete-user', (req, res) => {
  const clientId = req.body;
  const sql = 'DELETE FROM user_table WHERE UserId = ?';
  clientId.forEach((id) => {
    db.query(sql, [id], (err, result) => {
      if(err){
        result.status(500).json({error: "Error on Deleting the User", err})
      } else {
        console.log('Success')
      }
    })
  })
  res.status(200).json({success: "User Deleted Successfully"})

})

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});