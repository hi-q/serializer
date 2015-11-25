interface Entity<T> {
	new(...args: any[]): T
}

const isObject = (something: any): boolean => { return false }
const isArray = (something: any): boolean => { return false }

class SerializationError extends Error {
	constructor(message?: string, public raw?: any) {
		super(message)
	}
}

class Serializer {
	deserialize<T>(raw: string, TypeCtor: Entity<T>):T|T[] {
		const deserialized: any = Serializer.parse(raw)
		
		if (isObject(deserialized)) 
			return new TypeCtor(deserialized)
			
		if (isArray(deserialized)) 
			return deserialized.map((item) => new TypeCtor(item))
		
		throw new SerializationError("Serializer: unable to deserialize", raw)
	}
	
	private static parse(raw: string): any {
		try { return JSON.parse(raw) }
		catch (e) { 
			throw new SerializationError("Serializer: unable to deserialize", raw) 
		}	
	}
}

class A {
	i: number = 123
	getNum(): number {
		return this.i
	}
}

const a1 = new A()
const serializedA1 = JSON.stringify(a1)

const serializer = new Serializer()
const a2 = <A>serializer.deserialize(serializedA1, A)
const num = a2.getNum()
console.assert(num === 123)