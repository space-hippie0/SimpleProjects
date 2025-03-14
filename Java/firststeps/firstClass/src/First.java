
public class First {
    
    //Attributes
    private int ID;
    private String name;
    private String description;

    //Constructor
    public First(int ID, String name){

        this.ID=ID;
        this.name=name;
        this.description="";
    }

    //getters

    public String getName(){
        return this.name;
    }
    public String getInformation(){

        String information = "ID: " + this.ID + " Name: " + this.name + " Description: " + this.description;

        return information;
    }

    
    //setters
    public void setDescription(String descr){
        this.description=descr;
    }

    public static void main(String[] args){

        //First fc = new First(1, "Polito");
        //System.out.println(fc.getInformation());

        System.out.println("Hello world!");
        //System.out.println(name);

        First fc = new First(1, "name1");
        String i= fc.getInformation();
        System.out.println(i);

        //System.out.println(name);

        // Definition of a reference to an array of int
        int arr[];
        // Instantiation of an array of 10 int elements
        arr = new int[10];
        // Assign value to an array cell
        arr[2]=3;
        //Illegal access to an array cell
        //arr[11]=4;
        //for (int j=0; j<arr.length;j++) {
        int j=0;    
        for (int el: arr) {
            System.out.println ("The element of "+  j + "the array is " + el);
            j++;
        }


        String[] p = 
        {new String("John") ,
         new String("Susan")};

        for (String s: p) {

            System.out.println("Name:"+s);
        } 


        Car c1 = new Car();
        c1.printBuiltCars();

        Car c2 = new Car();

        c2.printBuiltCars();


        System.out.println ("The sum of 5 and 3 is"+
        Mathutils.sum(5, 3));

        System.out.println ("The diff of 5 and 3 is"+
        Mathutils.diff(5, 3));


    }



}
