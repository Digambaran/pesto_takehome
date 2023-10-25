function List() {
    return ['a', 'b', 'c'].map((v: string) => <h2 key={v}>{v}</h2>);
}

export {
    List as LList
} 