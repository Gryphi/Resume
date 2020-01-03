public class Node{
	Node next;
	int val;

public Node(int val){
	this.val = val;
}
	
public Node(Node next, int val){
	this.next = next;
	this.val = val;	
}

public int get(){
	return this.val;
}

public void set(int val){
	this.val = val;
}


public Node getNext(){
	return this.next;
}

public void setNext(Node nextNode){
	this.next = nextNode;
}





}
