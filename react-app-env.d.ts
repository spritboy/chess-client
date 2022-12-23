declare module '*.less' {
  interface Style {
    [propName: string]: string
  }
  const style: Style
  export default style
}
