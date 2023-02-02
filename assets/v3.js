// In v3 we read and process multiple text files. We use the functionality from v2 and v1 to load and process files, and in v3 we'll add the ability to see the conversation and the ngrams.

async function main() {
  console.log('v3 Hello World!');
  let container = d3.select('#container');
  //  let _status = d3.select('#status');
  let submit_button = d3.select('#submit_button');
  let file_selector = d3.select('#file_selector');
  let file_list, files_to_read;
  let conversation_data_all;

  // On Submit, get all the files that we're going to read.
  submit_button.on('click', () => {
    // First, check if we have any files to process.
    file_list = Array.from(file_selector.node().files);
    files_to_read = [];
    conversation_data_all = [];
    if (file_list.length > 0) {
      // There is at least 1 file to process. Check if the format is something usable.
      // Usable here means:
      // (File supports "file.type" property) AND (file.type is "text/*)
      // Copy usable files to files_to_read.

      file_list.forEach(file => {
        if (file.type && file.type.match('text/*')) {
          files_to_read.push(file);
        }
      });
    }

    // Use Promises to read files asynchronolously. Use the resolved values to create a structured dataset: conversation_data_all.
    let promises = [];
    files_to_read.forEach(file => {
      console.log(`reading ${file.name}...`);
      let file_promise = new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
      });
      promises.push(file_promise);
    });
    // Once all files have been read, create a structured dataset to work with.
    Promise.all(promises).then(file_contents => {
      console.log(file_contents);
      file_contents.forEach(file_content => {
        let conversation_data = d3.dsvFormat(';').parse(file_content);
        conversation_data.forEach(line => {
          conversation_data_all.push(line);
        });
      });
      console.log(conversation_data_all);
    });

    //   console.log(files_to_read);
    // let data = await read_conversations_to_data(files_to_read);
    // console.log(data);
  });
}
main();
