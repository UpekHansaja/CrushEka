package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import entity.User_Status;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.HibernateUtil;
import model.Validation;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author upekhansaja
 */
@MultipartConfig
@WebServlet(name = "SignUp", urlPatterns = {"/SignUp"})
public class SignUp extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        JsonObject responseJson = new JsonObject();
        responseJson.addProperty("success", false);

        String mobile = req.getParameter("mobile");
        String firstName = req.getParameter("firstName");
        String lastName = req.getParameter("lastName");
        String password = req.getParameter("password");
        Part avatarImage = req.getPart("avatarImage");

        if (mobile.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Mobile Number");
        } else if (!Validation.isMobileNumberValid(mobile)) {
            responseJson.addProperty("message", "Invalid Mobile Number");
        } else if (firstName.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your First Name");
        } else if (lastName.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Last Name");
        } else if (password.isEmpty()) {
            responseJson.addProperty("message", "Please Fill Your Password");
        } else if (!Validation.isPasswordValid(password)) {
            responseJson.addProperty("message", "Password must include at least 8 characters including one"
                    + " uppercase letter, number, special character");
        } else {

            Session session = HibernateUtil.getSessionFactory().openSession();

            Criteria criteria1 = session.createCriteria(User.class);
            criteria1.add(Restrictions.eq("mobile", mobile));

            if (!criteria1.list().isEmpty()) {
                responseJson.addProperty("message", "Mobile Number Already Used!");
            } else {

                User user = new User();
                user.setFirst_name(firstName);
                user.setLast_name(lastName);
                user.setMobile(mobile);
                user.setPassword(password);
                user.setRegistered_date_time(new Date());

                //get User Status 2 = Offline
                User_Status user_Status = (User_Status) session.get(User_Status.class, 2);
                user.setUser_status_id(user_Status);

                session.save(user);
                session.beginTransaction().commit();

                //check uploaded image
                if (avatarImage != null) {
                    String serverPath = req.getServletContext().getRealPath("");
                    String avatarImagePath = serverPath + "//" + "AvatarImages" + "//" + mobile + ".png";
                    System.out.println(avatarImagePath);
                    File file = new File(avatarImagePath);
                    Files.copy(avatarImage.getInputStream(), file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                }

                responseJson.addProperty("success", true);
                responseJson.addProperty("message", "Registration Complete");
                responseJson.add("user", gson.toJsonTree(user));
            }
            session.close();
        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseJson));
    }

}
