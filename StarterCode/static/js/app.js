//add the dropdown menu with list of names
//first, select all the data using #selDataset
//second, in the html, append this list of names
function dropdown() {
    d3.json("samples.json").then(data => {
        var sampleName = data.names;
        var name_id = d3.select("#selDataset")
        sampleName.forEach((sample_id) => {
            name_id.append("option")
                .text(sample_id)
                .property("value", sample_id)
        })
        //var firstsample = sampleName[0];
        //metadata(firstsample);
        //Graphs(firstsample);
    });
};  

//execute the function you just created
    dropdown();

//choose a specific name_id
//add the metadata by filtering on id
//add the key-value pair from the metadata JSON object somewhere on the page.
    function metadata(id) {
        d3.json("samples.json").then(data => {
            var sampleMetadata = data.metadata;
            var result = sampleMetadata.filter(obj => obj.id == id);
            var filtered_result = result[0];
            var display = d3.select("#sample-metadata");
            display.html("");
            Object.entries(filtered_result).forEach(([key, value]) => {
                display.append("h6").text(`${key} ${value}`);
            });
    
        });
    }
    
//bar chart and bubble plot based on selected id
//x: out_ids, y: sample_values, markersize: sample_values, color: otu_ids, 
    function Graphs(id) {
        d3.json("./samples.json").then(data => {
            var sampledata = data.samples;
            var result = sampledata.filter(obj => obj.id == id);
            var filtered_result = result[0];
            var otu_ids = filtered_result.otu_ids;
            var otu_labels = filtered_result.otu_labels;
            var sample_values = filtered_result.sample_values;
            var bubbledata = [{
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }];
            //bar chart displaying top 10
            //x: out_ids, y: sample_values, hovertext: otu_labels
            var barData = [{
                y: otu_ids.slice(0, 10).map(val => `OTU ${val}`).reverse(),
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }];
            let layout = {
                title: "Top 10 Bacteria Cultures Found"
              };

            let layout2 = {
                title: "Bacteria Cultures Per Sample"
              };
            Plotly.newPlot("bar", barData,layout);
    
            Plotly.newPlot("bubble", bubbledata,layout2);
    
        });
    };
    
//if id is changed, update plots and data
function optionChanged(changed_id) {
    metadata(changed_id);
    Graphs(changed_id);
};    
