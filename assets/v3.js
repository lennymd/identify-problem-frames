// In v3 we read and process multiple text files. We use the functionality from v2 and v1 to load and process files, and in v3 we'll add the ability to see the conversation and the ngrams.

async function main() {
  console.log('v3 Hello World!');
  let container = d3.select('#container');
  let _status = d3.select('#status');
  let submit_button = d3.select('#submit_button');
  let file_selector = d3.select('#file_selector');
  let file_list, files_to_read, files_data;
  submit_button.on('click', () => {
    // First, check if we have any files to process.
    file_list = Array.from(file_selector.node().files);
    files_to_read = [];
    files_data = [];
    if (file_list.length > 0) {
      // There is at least 1 file to process. Check if the format is something usable. Usable here means:
      // 1. File supports "file.type" property.
      // 2. File.type property is "text/*".
      // Copy usable files to files_to_read.

      file_list.forEach(file => {
        if (file.type && file.type.match('text/*')) {
          files_to_read.push(file);
        }
      });
    }

    // There is future work in identifying the kind of files we're working with and their delimiters. Right now for DTRS we're using TXT files with ';' as a delimiter.
    // TODO - add a way to identify the kind of files we're working with and their delimiters.

    // We want to reach file and push the contents to files_data.
    files_to_read.forEach(file => {
      let reader = new FileReader();
      reader.onload = function (e) {
        let datum = d3.dsvFormat(';').parse(reader.result);
        files_data.push(datum);
      };
      reader.readAsText(file);
    });
    console.log(files_data);
  });
}
main();
