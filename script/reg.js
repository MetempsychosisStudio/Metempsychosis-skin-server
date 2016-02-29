function reg(username, password) {
    fs.readFile('./data/players.json', function(fileData) {
        var userInfo = JSON.parse(fileData)
    })
}
module.exports = reg;
