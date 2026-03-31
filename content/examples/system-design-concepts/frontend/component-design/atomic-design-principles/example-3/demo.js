function auditAtom(name, propNames) {
  const businessProps = propNames.filter((prop) => /(article|checkout|plan|pricing|entitlement)/i.test(prop));
  return {
    name,
    promoteToMolecule: businessProps.length >= 2,
    businessProps,
    reason: businessProps.length >= 2 ? "Atom is carrying feature-specific concerns." : "Atom is still generic."
  };
}

console.log(auditAtom("PrimaryButton", ["variant", "size", "articleId", "pricingState"]));
console.log(auditAtom("IconBadge", ["variant", "size", "disabled"]));
