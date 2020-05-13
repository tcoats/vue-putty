const istouch = (('ontouchstart' in global)
  || global.DocumentTouch && document instanceof global.DocumentTouch)
  || navigator.msMaxTouchPoints
  || false

const noop = () => {}

export default {
  name: 'putty',
  functional: true,
  render: (h, { listeners, scopedSlots }) => {
    const emit = {
      start: listeners.start || noop,
      move: listeners.move || noop,
      end: listeners.end || noop,
      tap: listeners.tap || noop,
      leave: listeners.leave || noop,
      hover: listeners.hover || noop
    }
    let hasmoved = null
    let start = null
    let delta = null
    const mousemove = e => {
      const rect = e.target.getBoundingClientRect()
      const current = [e.clientX - rect.left, e.clientY - rect.top]
      delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        emit.start({ start })
        hasmoved = true
      }
      emit.move({ start, current, delta })
    }
    const hover = e => {
      if (hasmoved) return
      const rect = e.target.getBoundingClientRect()
      const current = [e.clientX - rect.left, e.clientY - rect.top]
      emit.hover({ current })
    }
    const mouseleave = e => {
      if (hasmoved) return
      emit.leave()
    }
    const mouseup = e => {
      const rect = e.target.getBoundingClientRect()
      const end = [e.clientX - rect.left, e.clientY - rect.top]
      const delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
      if (!hasmoved) emit.tap(start)
      else emit.end({ start, end, delta })
      hasmoved = false
    }
    const mousedown = e => {
      e.preventDefault()
      let rect = e.target.getBoundingClientRect()
      start = [e.clientX - rect.left, e.clientY - rect.top]
      hasmoved = false
      window.addEventListener('mousemove', mousemove)
      window.addEventListener('mouseup', mouseup)
    }
    const touchmove = e => {
      const rect = e.target.getBoundingClientRect()
      const current = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top]
      const delta = [current[0] - start[0], current[1] - start[1]]
      if (!hasmoved) {
        emit.start({ start })
        hasmoved = true
      }
      emit.move({ start, current, delta })
    }
    const touchend = e => {
      const rect = e.target.getBoundingClientRect()
      const end = [e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top]
      const delta = [end[0] - start[0], end[1] - start[1]]
      window.removeEventListener('touchmove', touchmove)
      window.removeEventListener('touchend', touchend)
      if (!hasmoved) emit.tap(start)
      else emit.end({ start, end, delta })
    }
    const touchstart = e => {
      e.preventDefault()
      hasmoved = false
      let rect = e.target.getBoundingClientRect()
      start = [
        e.touches[0].clientX - rect.left,
        e.touches[0].clientY - rect.top]
      window.addEventListener('touchmove', touchmove)
      window.addEventListener('touchend', touchend)
    }
    const content = scopedSlots.default ? [scopedSlots.default()] : []
    return istouch
      ? h('div', { class: { putty: true }, on: { touchstart }}, content)
      : h('div', { class: { putty: true }, on: { mousedown, mousemove: hover, mouseleave }}, content)
  }
}

// if (module && module.hot) {
//   const api = require('vue-hot-reload-api')
//   const Vue = require('vue')
//   api.install(Vue)
//   if (!api.compatible) throw new Error('vue-hot-reload-api is not compatible with the version of Vue you are using.')
//   module.hot.accept()
//   if (!module.hot.data) api.createRecord('putty', component)
//   else api.rerender('putty', component)
// }
