package it.polito.eng.deomopackage;


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


    }



}
