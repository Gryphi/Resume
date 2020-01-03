public class IntLList{

    private Node head;
    private int size = 0;
    
    public IntLList(){
	this.head = null;
    }

	public IntLList(IntLList o){
	this.head = null;
	  
	for (int i = 0; i < o.size; i++){
		add(o.get(i));
	}
	  
	}
	
    public void add(int val){
	
	Node temp = new Node(val);
	Node current = head;

	if (head == null){
	    head = new Node(val);
	} else {
	
	    while(current.getNext() != null){
		current = current.getNext();
	    }
	    
	    current.setNext(temp);
	}
	
	size++;
    }
    
    public void removeLast(){

	if (size == 1){
	    head = null;
	} else if (size == 2){
	    head.setNext(null);
	} else {
	
	    Node previous = head;
	    Node toRemove;
	    Node post;
	    
	    for (int i = 0; i < size - 2; i++){
		previous = previous.getNext();
	    }
	    
	    toRemove = previous.getNext();
	    post = toRemove.getNext();
	    toRemove = null;
	    previous.setNext(post);
	}
	size--;
    }

    public int get(int index){

	Node current = head;

	for (int i = 0; i < index; i++){
	    current = current.getNext();
	}
	
	return current.get();
    }

    public void set(int index, int val){

	Node temp = new Node(val);
    	Node current = head;

    	if (index == 0){
	    this.head = temp;
   	} else{
	    for(int i = 1; i < index; i++){
		current = current.getNext();
	    }
	    temp.setNext(current.getNext());
	    current.setNext(temp);
	}
    }

    public void remove(int index){
	
	if (index == 0){
	    if (head.getNext() != null){
		head = head.getNext();
	    }else {
		head = null;
	    }
	} else {
	    
	    Node previous = head;
	    Node toRemove;
	    Node post;
	    
	    for (int i = 0; i < index - 1; i++){
		previous = previous.getNext();
	    }
	    
	    toRemove = previous.getNext();
	    post = toRemove.getNext();
	    toRemove = null;
	    previous.setNext(post);
	}
	size--;
    }

    public String toString(){
	String concat = "";
	
	if (head == null){
		concat = "[EMPTY";
	} else {
	
		concat += "[" + Integer.toString(this.head.get());
		Node current = head.getNext();
		while(current != null){
			concat += ", " +Integer.toString(current.get());
			current = current.getNext();
		}
	}
	return concat + "]";
	
    }
    
    public void clear(){
	head = null;
    }
	                                          
	public static void main(String[] args){
		/*
		IntLList ll = new IntLList();
		ll.add(90);
		ll.add(91);
		System.out.println(ll.toString());
		ll.set(0,13);
		ll.set(1,14);
		System.out.println(ll.get(0));
		System.out.println(ll.toString());		
		ll.remove(0);
		System.out.println(ll.toString());
		ll.add(92);
		ll.add(93);
		ll.add(94);
		ll.add(95);
		ll.add(96);
		ll.add(97);
		System.out.println(ll.toString());
		ll.remove(0);
		ll.remove(2);
		System.out.println(ll.toString());
		ll.removeLast();
		System.out.println(ll.toString());
		ll.removeLast();
		System.out.println(ll.toString());
		ll.clear();
		System.out.println(ll.toString());	
		*/
		IntLList ll = new IntLList();
		ll.add(90);
		ll.add(91);
		ll.add(92);
		System.out.println("Orig: " + ll.toString());
		IntLList llCopy = new IntLList(ll);
		System.out.println("Copy: " + llCopy.toString());		
		llCopy.add(93);
		System.out.println("Added 93 to Copy");
		System.out.println("Orig: " + ll.toString());
		System.out.println("Copy: " + llCopy.toString());
	}
   
}
