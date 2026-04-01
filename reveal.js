(function () {
  "use strict"

  var nodes = document.querySelectorAll(".reveal")
  if (!nodes.length) return

  nodes.forEach(function (el, i) {
    el.style.setProperty("--reveal-order", String(Math.min(i, 8)))
  })

  if (!("IntersectionObserver" in window)) {
    nodes.forEach(function (el) {
      el.classList.add("is-visible")
    })
    return
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(function (el) {
      el.classList.add("reveal--instant")
    })
    return
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.06, rootMargin: "0px 0px -32px 0px" }
  )

  nodes.forEach(function (el) {
    io.observe(el)
  })
})()
