package firstClass;
public class Bicycle {

    // Attributes
    private String color; 
    private String brand;
    public String plate;
    private boolean isElectrical;
    private int size;
    private float priceRange;

    public Bicycle(String x){
        color=x; 
    };

    public Bicycle(String color, String brand) {
        this.color = color;
        this.brand = brand;

    }

    /* 

    You canno create this constructor since the 
    signature is the same as the previous 
    one.



    public Bicycle(String color, String plate) {
        this.color = color;
        this.plate = plate;
    }

    */


    public String getColor(){
        return this.color;
    }



}
