export const flattenTree = (nodes, parentId = null) => {
    return nodes.flatMap(node => {
        const { children, ...rest } = node;
        const flat = [{ ...rest, parentId }];
        if (Array.isArray(children) && children.length) {
            flat.push(...flattenTree(children, node.id));
        }
        return flat;
    });
};
