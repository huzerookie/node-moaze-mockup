const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const bodyparser = require("body-parser");
const generatePDF = require("./pdfGenerate");
var zipDirectory = require("./zipDirectory");
const dataSet = require("./public/utils/js/data/batul.json");
var uuidv4 = require("uuid");
var fs = require("fs");

//Define paths for Express Config
const path = require("path");
// console.log(__dirname)
console.log(path.join(__dirname, "/public"));
const publicPathDirectory = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/templates/views");
const partialsPath = path.join(__dirname, "/templates/partials");
const bootstrapPath = path.join(__dirname, "/node_modules/bootstrap/dist/css");
const fontawesomePath = path.join(__dirname, "/node_modules/fontawesome/css");
app.use(bodyparser.json());
//Setup Handlerbars engine and view location
app.set("views", viewsPath);
app.set("view engine", "hbs");
hbs.registerPartials(partialsPath);
app.use(express.static(publicPathDirectory));
app.use("/nodemodules", express.static(path.join(__dirname, "node_modules/")));

//Index Page
app.get("", (req, res) => {
  res.render("index", {
    title: "Mauze Project Mockup",
    copyrightName: "Huzefa",
  });
});
app.get("/jamiat/:id", (req, res) => {
  console.log("Jamiat ID:" + req.params.id);
  res.render("moaze", {
    title: "Mauze",
    copyrightName: "Huzefa",
    moazeList: [
      {
        moazeName: "Mauze 1",
        moazeLocation: "Hyderabad",
        moazeId: 1,
      },
      {
        moazeName: "Mauze 2",
        moazeLocation: "Vishakapatnam",
        moazeId: 2,
      },
      {
        moazeName: "Mauze 3",
        moazeLocation: "Bangalore",
        moazeId: 3,
      },
    ],
  });
});
app.get("/moaze/:id", (req, res) => {
  console.log("Moaze ID:" + req.params.id);
  res.render("mumineen", {
    title: "Committe Members",
    copyrightName: "Huzefa",
    mumineenList: [
      {
        mumineenName: "Huzefa Nullwala",
        mumineenId: 1,
        mumineenMoaze: req.params.id,
      },
      {
        mumineenName: "Sakina Rampurawala",
        mumineenId: 2,
        mumineenMoaze: req.params.id,
      },
      {
        mumineenName: "Batul Rampurawala",
        mumineenId: 3,
        mumineenMoaze: req.params.id,
      },
    ],
  });
});

//Download Single PDF
app.get("/downloadSingle", async (req, res) => {
  const uuid = uuidv4.v4();
  console.log(req.query.name + " " + req.query.id);
  await generatePDF.generatePDF(dataSet, req.query.name, uuid);
  var file = fs.createReadStream(`${__dirname}/pdfs/${uuid}.pdf`);
  var stat = fs.statSync(`${__dirname}/pdfs/${uuid}.pdf`);
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${uuid}.pdf`);
  file.pipe(res);
  //res.redirect(`/moaze/${req.query.id}`);
});

//Download Multiple PDF
app.get("/downloadMultiple", async (req, res) => {
  const folderName = uuidv4.v4();
  var mumineenList = [
    {
      mumineenName: "Huzefa Nullwala",
      mumineenId: 1,
    },
    {
      mumineenName: "Sakina Rampurawala",
      mumineenId: 2,
    },
    {
      mumineenName: "Batul Rampurawala",
      mumineenId: 3,
    },
  ];
  for (mumineen of mumineenList) {
    await generatePDF.generatePDF(
      dataSet,
      mumineen.mumineenName,
      uuidv4.v4(),
      folderName
    );
  }
  await zipDirectory.zipDirectory(
    `${__dirname}/zips/${folderName}`,
    `${__dirname}/zips/${folderName}.zip`
  );
  var file = fs.createReadStream(`${__dirname}/zips/${folderName}.zip`);
  var stat = fs.statSync(`${__dirname}/zips/${folderName}.zip`);
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "fileType");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${folderName}.zip`
  );
  file.pipe(res);
  //res.redirect(`/moaze/${req.query.id}`);
});

app.listen(port, () => {
  console.log("Server started at port " + port);
});
