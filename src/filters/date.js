export default function (value) {
  if (typeof value === "object") {
    if (value) {
      const date = new Date(value.date)
      return date.toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric'})
    }
    return ''
  }
  if (value) {
    const date = new Date(value)
    return date.toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric'})
  }
  return ''
}
