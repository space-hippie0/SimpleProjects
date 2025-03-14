import transport.Bicycle;

public class App {
    public static void main(String[] args) throws Exception {


        Bicycle bike = new Bicycle("purple");

        bike.setModelNumber(333);
        System.out.println(bike.getModelNumber());


        Bicycle myBike = new Bicycle();
        myBike.setColor("purple");
        myBike.setModelNumber(333);

        Bicycle PerfBicycle = myBike;
        
        // comparing references
        if (myBike == PerfBicycle){
            System.out.println("same");
        } else {
            System.out.println("nope");
        }

        // comparing object attributes
        if (myBike.isSameBike(bike)){
            System.out.println("def same");
        } else {
            System.out.println("def not the same");
        }

        Bicycle duplicatedBike = new Bicycle(myBike);
        System.out.println(duplicatedBike + " " + myBike);
        System.out.println(duplicatedBike.isSameBike(myBike));
    }
}
