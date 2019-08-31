setInterval(tickTime, 5000)

function tickTime() {
  try {
    const now = new Date()
    sysClock.innerText = ['Hours', 'Minutes'].map(unit => 
      now['get'+unit]().toString().padStart(2, '0')).join(':')
  } catch (error) { console.log(error) }
}