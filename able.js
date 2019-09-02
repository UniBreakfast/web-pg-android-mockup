const app = { backStack: [], 
              back() { if (app.backStack.length) app.backStack.pop()() } },
      upd = {}

addEventListener('load', () => {

  document.querySelectorAll('.switchable').forEach(area => {
    var timedOnOff
    (area.switch = (mode, backable=1) => {
      const current = area.dataset.active
      if (mode == current && backable == 1) return
      
      area.querySelectorAll('.mode').forEach(el => {
        const id = area.id.toLowerCase()
        if (!el.dataset[id]) return
        if (el.dataset[id] != mode) return el.classList.remove('active')
        el.classList.add('active')
        if (el.render) el.render()
      })
      if (backable) {
        if (backable > 1) clearTimeout(timedOnOff),
          timedOnOff = setTimeout(()=> area.switch('', 0), backable*1000)
        else app.backStack.push(()=> {
          area.switch(current, 0)
          if (typeof backable == 'function') backable()
        })
      }
      area.dataset.active = mode
      if (event) event.preventDefault()
    })(area.dataset.active, 0)
  })
  
  document.querySelectorAll('.renderable').forEach(area => {
    const template = area.innerHTML, callbacks = [],
          srcProp = area.dataset.src, source = app[srcProp], 
          placeholders = [...new Set(template.match(/\{.+?\}/g))]
            .reduce((dic, holder) => ({...dic, [holder]: holder
              .split(/[.{}[\]]/g).filter(v => v)}), {});

    (area.render = callback => {

      if (callback) return callbacks.push(callback)

      const src = Array.isArray(source)? 
              source.map((obj, i) => ({...obj, i: i+1})) : 
                Object.entries(source).map(([key, val], i) => 
                  ({key, val, i: i+1})),
            placeValues = src.map(props => Object.entries(placeholders)
              .reduce((dic, [holder, path]) => ({...dic, [holder]: path
                .reduce((val, prop) => val[prop], props)}), {}))

      area.innerHTML = placeValues.reduce((html, dic) => html + 
        Object.entries(dic).reduce((html, [holder, value]) => 
          html.split(holder).join(value), template), '')

      callbacks.forEach(callback => callback())
    })()
    
    var previouslyPlanned = 0
    const otherAreaRender = upd[srcProp]? 
      Object.getOwnPropertyDescriptor(upd, srcProp).get : ()=>{}

    Object.defineProperty(upd, srcProp, { configurable: true, get: () => 
      (clearTimeout(previouslyPlanned), previouslyPlanned = setTimeout( () => 
        ( area.render(), otherAreaRender() ), 0 ), source) })
  })

})

document.head.appendChild(document.createElement('style'))
  .innerText = '.mode:not(.active) { display: none !important }'
