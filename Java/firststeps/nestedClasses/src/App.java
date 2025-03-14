public class App {
    public static void main(String[] args) throws Exception {

        Stack s = new Stack(5);
        int e;
        e = s.pop();

        for (int i=1; i<=6; i++) {
            s.push(i);
        }

        for (int i=1; i<=5; i++) {
            System.out.println (s.pop());
        }

        //I cannot see the element class outside
        //Element e = new Element(3);

        //Instance of an Element defined
        //Inside Stack
        Stack.Element e1 = new Stack.Element(3);

        //Instance of an object of
        //Class element
        Element e2 = new Element();
        e2.printmessage();


        //Use of inheritance

        ExtendedStack es = new ExtendedStack(3);
        es.push(1);
        es.push(2);
        es.push(3);
        es.printStack();
        es.pop();

        //Polymorfism
        Stack s1;
        
        s1=es;
        //Not possible because of ploymorphism
        //s1.printStack();

        Stack sv[] = new Stack[2];
        sv[0] = new Stack(10);
        sv[1] = new ExtendedStack(3);

        // Dinamyc Binding
        //Stack s3 = sv[1];
        //s3.printStack();

        //Not ok generates runtime error
        //ExtendedStack s2 = (ExtendedStack) sv[0];
        //s2.printStack();

        ExtendedStack s2 = (ExtendedStack) sv[1];
        s2.printStack();


    }
};
