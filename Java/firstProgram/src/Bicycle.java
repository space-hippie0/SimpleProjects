public class Bicycle {

    // attributes
    private String wheelType;
    private int modelNumber;
    private String color;
    private String productionDate;

    // constructor
    public Bicycle(String wheelType){
        this.wheelType = wheelType;
    }

    // methods
    public void setColor(String newcolor){
        color = newcolor;
    }

    public String getColor(){
        return color;
    }

    public int getModelNumber(){
        return modelNumber;
    }

    public void setModelNumber(int modelNumber){
        this.modelNumber = modelNumber;
    }

    
}
