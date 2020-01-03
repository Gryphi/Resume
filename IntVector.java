public class IntVector {
    
    private int[] array;
    private int numElements;
    
    private void expandArray(){
	int[] newArray = new int[array.length *2];
	for (int i = 0; i < numElements; i++)
	    newArray[i] = array[i];
	array = newArray;
    }
    
    public IntVector(int initialSize){
	array = new int[initialSize];
	numElements = 0;
    }
	
	public IntVector(IntVector o){
		numElements = o.size();
		array = new int[numElements];
		for (int i = 0; i < numElements; i++){
			set(i, o.get(i));
		}
		
	}
    
    public void add(int val){
	if (array.length == numElements)
	    expandArray();
	array[numElements] = val;
	numElements += 1;
    }
    
    public void removeLast(){
	array[numElements] = 0;
	numElements -= 1;
    }
    
    public int get(int index){
	return array[index];
    }
    
    public void set(int index, int val){
	array[index] = val;
    }
    
    public void remove(int index){
	for (int i = index; i < numElements; i++)
	    array[i] = array[i + 1];
	removeLast();
    }
    
    public int size(){
	return numElements;
    }
    
    @Override
    public  String toString(){
	String arrayString = "[" + Integer.toString(array[0]);
	for (int i = 1; i < numElements; i++)
	    arrayString += (", " + Integer.toString(array[i]));	
	return arrayString + "]";
    }
	
	public static void main(String[] args){
		IntVector iv = new IntVector(1);
		iv.add(90);
		iv.add(91);
		iv.add(92);
		System.out.println("Orig: " + iv.toString());
		IntVector ivCopy = new IntVector(iv);
		System.out.println("Copy: " + ivCopy.toString());		
		ivCopy.add(93);
		System.out.println("Added 93 to Copy");
		System.out.println("Orig: " + iv.toString());
		System.out.println("Copy: " + ivCopy.toString());
	}
    
    
}
