const internedObjectRefs = new Set<WeakRef<{ readonly [k: string]: unknown }>>()

export type Interned<T extends object> = { readonly [K in keyof T as K extends string ? K : never]: T[K] }

export type DeeplyInterned<T extends object> =
	{ readonly [K in keyof T as K extends string ? K : never]: T[K] extends object ? DeeplyInterned<T[K]> : T[K] }

const getInternedObjects = () => internedObjectRefs.values().flatMap(ref => {
	const interned = ref.deref()

	if (interned)
		return [ interned ]

	internedObjectRefs.delete(ref)

	return []
})

export const Interned = <T extends object>(object: T): Interned<T> => {
	const keys = Object.getOwnPropertyNames(object)
		.filter(key => "value" in Reflect.getOwnPropertyDescriptor(object, key)!)

	for (const internedObject of getInternedObjects()) {
		if (object == internedObject)
			return object

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

	const result = Object
		.freeze(Object.setPrototypeOf(Object.fromEntries(keys.sort().map(key => [ key, (object as any)[key] ])), null))

	internedObjectRefs.add(new WeakRef(result))

	return result
}

export const isInterned = (value: unknown): boolean =>
	getInternedObjects().some(internedObject => internedObject == value)

const isObject = (value: unknown): value is object => !!value && typeof value == "object" || typeof value == "function"

export const internDeeply = <T extends object>(object: T): DeeplyInterned<T> =>
	Interned(Object.fromEntries(Object.getOwnPropertyNames(object)
		.filter(key => "value" in Reflect.getOwnPropertyDescriptor(object, key)!)
		.map(key => [ key, isObject((object as any)[key]) ? internDeeply((object as any)[key]) : (object as any)[key] ])
	)) as DeeplyInterned<T>
