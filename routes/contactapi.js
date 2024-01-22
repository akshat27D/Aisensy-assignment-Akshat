const express=require("express")
const Contacts=require("../models/contact")
const router=express.Router()
const multer = require('multer');
const csvParser = require('csv-parser');
const exceljs = require('exceljs');

const upload = multer({ dest: 'uploads/' });

router.get("/api/contacts",async(req,res)=>{
  try {
    const contacts = await Contacts.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


router.post('/api/import', upload.single('file'), async (req, res) => {
  try {

    const filePath = req.file.path;
    if (filePath.endsWith('.csv')) {
        const contacts = [];
        require('fs').createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => {
            contacts.push({
              name: data.name,
              contact: data.contact,
              email: data.email,
            });
          })
          .on('end', async () => {
            await Contacts.insertMany(contacts);
            res.status(200).json({ message: 'Contacts imported successfully' });
          });
    } else if (filePath.endsWith('.xlsx')) {
        const contacts = [];
        const workbook = new exceljs.Workbook();
        
        await workbook.xlsx.readFile(filePath);
  
        const worksheet = workbook.getWorksheet(1);
  
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          contacts.push({
            name: row.getCell(1).value,
            phoneNumber: row.getCell(2).value,
            email: row.getCell(3).value,

          });
        });
  

        await Contacts.insertMany(contacts);
  
        res.status(200).json({ message: 'Contacts imported successfully' });
    } else {
      throw new Error('Invalid file format');
    }

    res.status(200).json({ message: 'Contacts imported successfully' });
  } catch (error) {
    console.log("hello 2");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router