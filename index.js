const istouch = (('ontouchstart' in global)
  || global.DocumentTouch && document instanceof global.DocumentTouch)
  || navigator.msMaxTouchPoints
  || false

const noop = () => {}

function putty(props, listeners) {
  const offset = props.offset || [0, 0]
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
  let rect = null
  const mousemove = e => {
    const current = [
      e.clientX - rect.left - offset[0],
      e.clientY - rect.top - offset[1]
    ]
    delta = [current[0] - start[0], current[1] - start[1]]
    if (!hasmoved) {
      emit.start(start)
      hasmoved = true
    }
    emit.move({ start, current, delta })
  }
  const hover = e => {
    if (hasmoved) return
    rect = e.target.getBoundingClientRect()
    const current = [
      e.clientX - rect.left - offset[0],
      e.clientY - rect.top - offset[1]
    ]
    emit.hover(current)
  }
  const mouseleave = e => {
    if (hasmoved) return
    emit.leave()
  }
  const mouseup = e => {
    const end = [
      e.clientX - rect.left - offset[0],
      e.clientY - rect.top - offset[1]
    ]
    const delta = [end[0] - start[0], end[1] - start[1]]
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    if (!hasmoved) emit.tap(start)
    else emit.end({ start, end, delta })
    hasmoved = false
  }
  const mousedown = e => {
    e.preventDefault()
    rect = e.target.getBoundingClientRect()
    start = [
      e.clientX - rect.left - offset[0],
      e.clientY - rect.top - offset[1]
    ]
    hasmoved = false
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }
  const touchmove = e => {
    const current = [
      e.touches[0].clientX - rect.left - offset[0],
      e.touches[0].clientY - rect.top - offset[1]
    ]
    const delta = [current[0] - start[0], current[1] - start[1]]
    if (!hasmoved) {
      emit.start(start)
      hasmoved = true
    }
    emit.move({ start, current, delta })
  }
  const touchend = e => {
    const end = [
      e.changedTouches[0].clientX - rect.left - offset[0],
      e.changedTouches[0].clientY - rect.top - offset[1]
    ]
    const delta = [end[0] - start[0], end[1] - start[1]]
    window.removeEventListener('touchmove', touchmove)
    window.removeEventListener('touchend', touchend)
    if (!hasmoved) emit.tap(start)
    else emit.end({ start, end, delta })
  }
  const touchstart = e => {
    e.preventDefault()
    hasmoved = false
    rect = e.target.getBoundingClientRect()
    start = [
      e.touches[0].clientX - rect.left - offset[0],
      e.touches[0].clientY - rect.top - offset[1]
    ]
    window.addEventListener('touchmove', touchmove)
    window.addEventListener('touchend', touchend)
  }
  return istouch
    ? { touchstart }
    : { mousedown, mousemove: hover, mouseleave }
}

export default {
  name: 'putty',
  functional: true,
  render: (h, { props, listeners, scopedSlots }) => {
    const content = scopedSlots.default ? [scopedSlots.default()] : []
    const className = props.className || 'putty'
    const tagName = props.tagName || 'div'
    return h(tagName, { class: { [className]: true }, on: putty(props, listeners)}, content)
  }
}

export { putty }

// if (module && module.hot) {
//   const api = require('vue-hot-reload-api')
//   const Vue = require('vue')
//   api.install(Vue)
//   if (!api.compatible) throw new Error('vue-hot-reload-api is not compatible with the version of Vue you are using.')
//   module.hot.accept()
//   if (!module.hot.data) api.createRecord('putty', component)
//   else api.rerender('putty', component)
// }
