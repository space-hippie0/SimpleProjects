package humanity;
import transport.Bicycle;

public class Mechanic {
    private String name;

    public Mechanic(String name){
        this.name = name;
    }

    public void repair(Bicycle b){
        System.out.println(name + " is repairing your bike");
    }
}
