//    var buttonSave = document.getElementById("buttonSave");
//    buttonSave.onclick = function saveResults() {
//
//        var o = {
//            participant: "P01",
//            firstBlock: {mode: "side panel",
//                         results: results,
//                         error: 0},
//            secondBlock: {mode: "tab bar",
//                          results: results,
//                          error: 0}
//        }      
//
//        if(results.length != 0){
//            var req = new XMLHttpRequest();
//            req.open("POST", "", false); // Syncronous call is deprecated. TODO
//            req.send(JSON.stringify(o));
//            console.log(req.responseText); 
//        }else{
//            alert("There is no result.");
//        }
//    }