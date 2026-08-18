//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `dsh-ui-background`.
* @module dsh-ui-background/invariant
*/
const PACKAGE_NAME = "dsh-ui-background";
/** Cordis companion plugin name. */
const name = "client-ui-background-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: the settings scope validates and publishes the durable
* background section, while the theme override layer tracks that value on the
* client. Scope/override agreement is covered directly by this package's Host
* and client apply specs.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
