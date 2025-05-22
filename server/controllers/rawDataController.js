import XLSX from "xlsx";
import { insertRawData , getRawData} from "../models/rawDataModel.js";

export const importRawData = async (req, res) => {
  try {
    const file = req.file;
    const { cat_id, reference } = req.body;
    const user_id = req.session?.user?.id;

    if (!file || !cat_id || !reference || !user_id) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = data
      .filter(row => row.name && row.contact && row.email && row.address) // prevent nulls
      .map(row => ({
        name: row.name,
        contact: row.contact,
        email: row.email,
        address: row.address,
        cat_name: cat_id,
        reference_name: reference,
        user_id: user_id
      }));

    if (formattedData.length === 0) {
      return res.status(400).json({ message: "No valid rows found in file." });
    }

    await insertRawData(formattedData);
    res.status(200).json({ message: "Data imported successfully!" });

  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).json({ message: "Server error while importing data." });
  }
};



// fetch raw data controller 
export const getAllRawData = async (req, res) => {
  try {
    const raw_data = await getRawData();
    // console.log('Users fetched from DB:', users); 
    res.status(200).json(raw_data);
  } catch (error) {
    console.error('Error fetching Raw Data:', error); 
    res.status(500).json({ error: 'Failed to fetch Raw Data' });
  }
};