// auth
var hasLocalStorageUser;
firebase.auth().getRedirectResult().then(function() {
     sessionStorage.setItem("User", "OK");
     hasLocalStorageUser = "OK";
});
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
if (!firebase.auth().currentUser) {
    hasLocalStorageUser = sessionStorage.getItem("User");
    if (hasLocalStorageUser != "OK") {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
    }
}
function plotBME280() {
    if (hasLocalStorageUser == "OK") {
        // Firestore
        var db = firebase.firestore();
        var cur = db.collection('terarko:BME280');
        cur = cur.orderBy('timestamp').limitToLast(192);
        var x = [];
        var temp = [];
        var hum = [];
        var press = [];
        var temp;
        var layout;
        var config;
        cur.get().then((docs) => {
            docs.forEach((doc) => {
                var date = new Date(doc.data().timestamp * 1000)
                date.setMinutes(date.getMinutes()-date.getTimezoneOffset())
                x.push(date.toISOString())
                temp.push(doc.data().temperature);
                hum.push(doc.data().humidity);
                press.push(doc.data().pressure);
            });
            temp = [
            {
                type: "Scattergl",
                mode: "lines",
                name: 'teplota',
                x: x,
                y: temp
            },
            {
                type: "Scattergl",
                mode: "lines",
                name: 'vlhkost',
                yaxis: 'y2',
                x: x,
                y: hum
            },
            {
                type: "Scattergl",
                mode: "lines",
                name: 'tlak',
                yaxis: 'y3',
                x: x,
                y: press
            }
            ];
            layout = {
                title: 'Hodnoty z terária',
                showlegend: true,
                xaxis: {
                    title: 'čas',
                },
/*
                grid: {
                    rows: 3,
                    columns: 1,
                    subplots: [['xy'], ['xy2'], ['xy3']]
                }
*/
                yaxis: {
                    title: 'teplota',
					domain: [0, 0.33]
                },
                yaxis2: {
                    title: 'vlhkost',
					domain: [0.33, 0.66]
                },
                yaxis3: {
                    title: 'tlak',
					domain: [0.66, 1]
                },
            };
            config = {
            };
            Plotly.newPlot('graph', temp, layout, config);
        });
    }
}
plotBME280();
