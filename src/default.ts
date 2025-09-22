const internedObjectRefs = new Set<WeakRef<{ [k: string]: unknown }>>()

export const Interned = <T extends object>(object: T): { readonly [K in keyof T as K extends string ? K : never]: T[K] } => {
	const keys = Object.getOwnPropertyNames(object)
		.filter(key => "value" in Reflect.getOwnPropertyDescriptor(object, key)!)

	for (const internedObjectRef of internedObjectRefs) {
		const internedObject = internedObjectRef.deref()

		if (!internedObject) {
			internedObjectRefs.delete(internedObjectRef)
			continue
		}

		const internedObjectKeys = Object.getOwnPropertyNames(internedObject)

		if (
			internedObjectKeys.length == keys.length &&
			internedObjectKeys.every(internedObjectKey =>
				keys.includes(internedObjectKey) &&
				Object.is(internedObject[internedObjectKey], (object as any)[internedObjectKey])
			)
		)
			return internedObject as T
	}

	const result =
		Object.freeze(Object.setPrototypeOf(Object.fromEntries(keys.sort().map(key => [ key, (object as any)[key] ])), null))

	internedObjectRefs.add(new WeakRef(result))

	return result
}

export const isInterned = (value: unknown): boolean => internedObjectRefs.values().some(internedObjectRef => {
	const internedObject = internedObjectRef.deref()

	if (!internedObject) {
		internedObjectRefs.delete(internedObjectRef)
		return false
	}

	return internedObject == value
})
