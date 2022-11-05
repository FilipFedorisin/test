export function syncKeyVal(key: string, value: string, setter: any) {
  setter((prevState: any) => {
    return {
      ...prevState,
      [key]: value,
    }
  })
}
