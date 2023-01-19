// TODO - on load, make sure that there is no file selected in the file selector.
async function main() {
  let container = d3.select('#container');
  let _status = d3.select('#status');
  let submit_button = d3.select('#submit_button');
  let file_selector = d3.select('#file_selector');

  submit_button.on('click', () => {
    // check if #file_selector has any files
    // TODO work with multiple files
    let file = file_selector.node().files[0];
    if (file) {
      // Check the filetype. It should be text/csv or something that can be read as a CSV.
      if (!file.type) {
        _status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
        return;
      }
      if (!file.type.match('text/*')) {
        _status.textContent = 'Error: The selected file does not appear to be a Text file.';
        return;
      }
      //  Read the file and display contents in #container
      let reader = new FileReader();
      reader.onload = function (e) {
        // DTRS files use ; as a delimiter. If you have a different delimiter, change the d3.dsvFormat() function.
        // TODO incorporate delimeter selection in the UI
        let data = d3.dsvFormat(';').parse(reader.result);
        console.log(data);
        // I'm following Senthil's python code and working with the data. Right now I want to see that all the parts work before making it work better with the UI.

        // Find n_grams
      };
      reader.readAsText(file);
    } else {
      // if no file, alert user to select a file
      alert('Please select a file before hitting submit');
    }
  });
}

main();
