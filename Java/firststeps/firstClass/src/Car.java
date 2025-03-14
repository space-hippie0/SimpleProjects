public class Car {
    static int countBuiltCars=0;
    public Car() {
        countBuiltCars++;
    }

    public void printBuiltCars() {
        System.out.println(countBuiltCars);
    }
}
