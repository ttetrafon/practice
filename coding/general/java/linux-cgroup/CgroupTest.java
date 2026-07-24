// CgroupTest.java
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.lang.reflect.Method;

public class CgroupTest {
    public static void main(String[] args) {
        System.out.println("--- Starting Cgroup Test Application ---");

        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();

        System.out.println("\n--- Operating System Information ---");
        System.out.println("OS Name: " + osBean.getName());
        System.out.println("OS Version: " + osBean.getVersion());
        System.out.println("OS Architecture: " + osBean.getArch());
        System.out.println("Available Processors: " + osBean.getAvailableProcessors());

        System.out.println("\n--- Attempting to get Container/Cgroup Metrics (if available) ---");
        try {
            Class<?> sunOsBeanClass = Class.forName("com.sun.management.OperatingSystemMXBean");
            if (sunOsBeanClass.isInstance(osBean)) {
                Method getTotalPhysicalMemorySize = sunOsBeanClass.getMethod("getTotalPhysicalMemorySize");
                long totalMemory = (long) getTotalPhysicalMemorySize.invoke(osBean);
                System.out.println("Total Physical Memory (bytes): " + totalMemory);

                Method getFreePhysicalMemorySize = sunOsBeanClass.getMethod("getFreePhysicalMemorySize");
                long freeMemory = (long) getFreePhysicalMemorySize.invoke(osBean);
                System.out.println("Free Physical Memory (bytes): " + freeMemory);

                Method getSystemCpuLoad = sunOsBeanClass.getMethod("getSystemCpuLoad");
                double systemCpuLoad = (double) getSystemCpuLoad.invoke(osBean);
                System.out.println("System CPU Load: " + systemCpuLoad);

                Method getProcessCpuLoad = sunOsBeanClass.getMethod("getProcessCpuLoad");
                double processCpuLoad = (double) getProcessCpuLoad.invoke(osBean);
                System.out.println("Process CPU Load: " + processCpuLoad);
            }
        } catch (Exception e) {
            System.err.println("Could not retrieve all detailed OS metrics (this is often expected in non-Sun JVMs or restricted environments): " + e.getMessage());
            if (e.getCause() instanceof NullPointerException && e.getCause().getMessage().contains("CgroupInfo.getMountPoint")) {
                System.err.println("!!! Detected the specific Cgroup NullPointerException here !!!");
                e.printStackTrace();
            }
        }

        System.out.println("\n--- Relevant System Properties (JVM's view of environment) ---");
        System.out.println("os.name: " + System.getProperty("os.name"));
        System.out.println("os.version: " + System.getProperty("os.version"));
        System.out.println("java.version: " + System.getProperty("java.version"));
        System.out.println("java.vm.name: " + System.getProperty("java.vm.name"));
        System.out.println("user.home: " + System.getProperty("user.home"));
        System.out.println("user.dir: " + System.getProperty("user.dir"));
        System.out.println("file.encoding: " + System.getProperty("file.encoding"));

        // Check for specific environment variables that might be set in containers
        System.out.println("\n--- Relevant Environment Variables (JVM's view of environment) ---");
        System.out.println("CONTAINER_NAME: " + System.getenv("CONTAINER_NAME"));
        System.out.println("HOSTNAME: " + System.getenv("HOSTNAME"));
        System.out.println("PATH: " + System.getenv("PATH"));


        System.out.println("\n--- Cgroup Test Application Finished ---");
    }
}
