public class ExtendedStack extends Stack{

    public ExtendedStack(int size) {
        super(size);
    }

    public void printStack(){
        
        for (int i = 0; i<sp; i++) {
            System.out.println(s[i].getE());
        }

    }

    //Overriding of the pop method
    public int pop() {
        int r = super.pop();
        System.out.println("The popped element is "+r);
        return r;
    }

}
