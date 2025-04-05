import {Event} from "/js/Event.js";

export class SecurityPolicyViolation extends Event
{
	static GetLocalName(){ return "securitypolicyviolation"; }
	static GetMetaURL(){ return import.meta.url; }
}