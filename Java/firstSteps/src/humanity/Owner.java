package humanity;
import transport.Bicycle;

public class Owner {
    private String name;
    private Bicycle b;
    private Mechanic m;
    

    public Owner(String name){
        this.name = name;
    }

    public void setBicycle(Bicycle b){
        this.b = b;
    }

    public void sendBikeToRepair(){
        m.repair(b);
    }
}
