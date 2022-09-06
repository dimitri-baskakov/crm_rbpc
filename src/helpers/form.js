class Form {
  constructor(data) {
    const formData = new FormData()
    let value
    for (const key of Object.keys(data)) {
      value = data[key];
      if (value instanceof Object) {
        for (let i of Object.keys(value)) {
          let val = value[i]
          if (val instanceof Object) {
            if (val instanceof File) {
              formData.append('files[]', val)
            } else {
              formData.append(key + '[]', JSON.stringify(val))
            }
          } else {
            formData.append(key + '[' + i + ']', !!val ? val : '')
          }
        }
      } else {
        if (key === 'id') {
          if (!!value) {
            formData.append('_method', 'put')
          }
        } else {
          formData.append(key, !!value ? value : '')
        }
      }
    }
    this.data = formData
  }
}

export default Form
