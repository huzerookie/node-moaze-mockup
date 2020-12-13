//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
var batulSet = require("./public/utils/js/data/batul.json");
// Read HTML Template

var generatePDF = (dataSet, mumineenName, uuid, folderName) => {
  return new Promise((resolve, reject) => {
    var html = fs.readFileSync("./templates/views/template.html", "utf8");
    var dirName = folderName ? `zips/${folderName}` : "pdfs";
    var options = {
      format: "A3",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Committe Member Response</div>',
      },
      footer: {
        height: "28mm",
        contents: {
          first: "Cover page",
          2: "Second page", // Any page number is working. 1-based index
          default:
            '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
          last: "Last Page",
        },
      },
    };

    var document = {
      html: html,
      data: {
        dataSet: dataSet,
        mumineenName: mumineenName,
      },
      path: `${dirName}/${uuid}.pdf`,
    };
    pdf
      .create(document, options)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
generatePDF(batulSet, "SomeName", "1234");
module.exports = {
  generatePDF,
};
