package transport;
public class Bicycle {

    // attributes
    private String wheelType;
    private int modelNumber;
    private String color;
    private String productionDate;

    // constructor
    public Bicycle(String color){
        this.color = color;
    }

    public void setColor(String color){
        this.color = color;
    }

    public void setModelNumber(int newMN){
        this.modelNumber = newMN;
    }

    // default
    public Bicycle(){

    }

    // Copy constructor
    public Bicycle(Bicycle anotherBike) {
        this.color = anotherBike.color;
        this.modelNumber = anotherBike.modelNumber;
        this.wheelType = anotherBike.wheelType;
        this.productionDate = anotherBike.productionDate;
    }

    public boolean isSameBike(Bicycle anotherBike){
        if (this.color == anotherBike.color && this.modelNumber == anotherBike.modelNumber){
            return true;
        } else {
            return false;
        }
    }

    // methods
    public String getColor(){
        return this.color;
    }

    

    public int getModelNumber(){
        return modelNumber;
    }
}
