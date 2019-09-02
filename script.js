['user','users','endeavors'].forEach(prop => app[prop] = [])
app.id = 1
// app.user = [{name: "clever_username"}]
// localStorage.user = JSON.stringify(app.user)

Object.entries(localStorage).forEach(([key, value]) => 
  app[key] = JSON.parse(value))

function lStore(...props) {
  props.forEach(prop => localStorage[prop] = JSON.stringify(app[prop]))
}