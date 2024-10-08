package entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat")
public class Chat implements Serializable{
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private User from_user;
    
    @ManyToOne
    @JoinColumn(name = "to_user_id")
    private User to_user;
    
    @Column(name = "message",nullable = false)
    private String message;
    
    @Column(name = "date_time",nullable = false)
    private Date date_time;
    
    @ManyToOne
    @JoinColumn(name = "chat_status_id")
    private Chat_Status chat_status_id;
    
}
