package it.lab15.dashup.jmx.sample.application;

import java.io.File;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Random;

public class SimpleJmxApplication  {

	private static int very_Expensive_Iterations = 10000000;
	private static int normal_Iterations = 1000;

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//"-Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=1234 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false";
		new SimpleJmxApplication().start();
	}
	
	private CoreThread coreThread;
	Random randomGenerator;
	
	public SimpleJmxApplication(){
		randomGenerator = new Random(System.currentTimeMillis());
	}
	
	public void start(){
		coreThread = new CoreThread();
		coreThread.start();
	}
	
	protected void handleEvents(){
		if (randomGenerator.nextBoolean()&&randomGenerator.nextBoolean()&&randomGenerator.nextBoolean()){
			if (randomGenerator.nextInt(100)>80){
				int iterations = randomGenerator.nextInt(normal_Iterations);
				doSomething(iterations);
			}
		}
	}
	
	private void doSomething(int iterations) {
		for (int i=0;i<iterations;i++){
			double x = randomGenerator.nextDouble();
			double y = randomGenerator.nextDouble();
			double z = Math.sin(x) * Math.cos(y);
		}
		System.out.println("Finished iteration for "+ iterations);
	}

	private class CoreThread extends Thread {
		public void run(){
			while(true){
				try {
					handleEvents();
					sleep(10);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	

}
